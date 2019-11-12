# LXC Based honeypot

## Openssh-server

Default `openssh-server` doesn't log password attempts.

So we're gonna build `openssh-server` from source, after adding a logline.

## LXC Base ( [docs](https://doc.ubuntu-fr.org/lxd) )

### Install

#### LXC container

First, let's install LXC and LXD.

```bash
sudo apt install lxd
```

##### Start Ubuntu base container

```bash
sudo lxc launch images:ubuntu/xenial honeypot
```

Here, honeypot is the name of our container.

##### Find out container IP

```bash
sudo lxc list
```

You can try to nmap the container, to make sure no service is exposed.

##### Jump into the container

```bash
sudo lxc shell honeypot
```

As now, we're inside the container.

#### Openssh-server [here](https://www.tecmint.com/install-openssh-server-from-source-in-linux/)

```bash
sudo apt update 
sudo apt install build-essential zlib1g-dev libssl-dev wget
sudo apt install libpam0g-dev libselinux1-dev

sudo mkdir /var/lib/sshd
sudo chmod -R 700 /var/lib/sshd/
sudo chown -R root:sys /var/lib/sshd/
sudo useradd -r -U -d /var/lib/sshd/ -c "sshd privsep" -s /bin/false sshd

wget -c https://cdn.openbsd.org/pub/OpenBSD/OpenSSH/portable/openssh-8.0p1.tar.gz
tar -xzf openssh-8.0p1.tar.gz
cd openssh-8.0p1/

./configure --with-md5-passwords --with-pam --with-selinux --with-privsep-path=/var/lib/sshd/ --sysconfdir=/etc/ssh 

sed -e 's/struct passwd \*pw = authctxt->pw;/logit("Honey: Username: %s Password: %s", authctxt->user, password);\nstruct passwd \*pw = authctxt->pw;/' -i auth-passwd.c
make

sudo make install 
```

After this, everything is installed. Now, we need to create a ssh/sshd service.

```bash
sudo cat > /lib/systemd/system/ssh.service << EOF
[Unit]
Description=Honeypot Money
After=network.target

[Service]
ExecStart=/usr/local/sbin/sshd -f /etc/ssh/sshd_config
Restart=on-failure
RestartPreventExitStatus=255

[Install]
WantedBy=multi-user.target
Alias=sshd.service
EOF
```

To redirect our ssh log into another file, we need to create a rsyslog config :

```bash
sudo cat > /etc/rsyslog.d/sshd.conf << EOF
if $programname == 'sshd' then /var/log/sshd.log
EOF

sudo systemctl restart rsyslog
```

Now, we need to enable ssh service.


### Map container ssh on host

Redirect all ssh traffic to lxc container.

```
CONTAINER_NAME="honeypot" PROXY_NAME="honeypot_ssh_proxy" sudo lxc config device add ${CONTAINER_NAME} ${PROXY_NAME} proxy listen=tcp:0.0.0.0:22 connect=tcp:0.0.0.0:22
```
