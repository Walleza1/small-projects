#!/bin/bash

if ! [ $(id -u) = 0 ]; then
   echo "Please run as root or with sudo "
   exit 1
fi

CONTAINER_NAME="honeypot"
SHELL="bash"

sudo apt install -y lxd
sudo lxc launch images:ubuntu/xenial ${CONTAINER_NAME}

sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "apt update"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "apt install -y build-essential zlib1g-dev libssl-dev wget"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "apt install -y libpam0g-dev libselinux1-dev"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "mkdir /var/lib/sshd"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "chmod -R 700 /var/lib/sshd/"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "chown -R root:sys /var/lib/sshd/"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "sudo useradd -r -U -d /var/lib/sshd/ -c \"ssd privsep\" -s /bin/false sshd"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "wget -c https://cdn.openbsd.org/pub/OpenBSD/OpenSSH/portable/openssh-8.0p1.tar.gz"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "tar -xzf openssh-8.0p1.tar.gz"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "cd openssh-8.0p1/ && ./configure --with-md5-passwords --with-pam --with-selinux --with-privsep-path=/var/lib/sshd/ --sysconfdir=/etc/ssh"

sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "cd openssh-8.0p1/ && sed -e 's/struct passwd \*pw = authctxt->pw;/logit(\"Honey: Username: %s Password: %s\", authctxt->user, password);\nstruct passwd \*pw = authctxt->pw;/' -i auth-passwd.c"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "cd openssh-8.0p1/ && make"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "cd openssh-8.0p1/ && make install"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "cat > /lib/systemd/system/ssh.service << EOF
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
"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c 'cat > /etc/rsyslog.d/sshd.conf << EOF
if \$programname == "sshd" then /var/log/sshd.log
EOF'
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "systemctl daemon-reload"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "systemctl restart rsyslog"
sudo lxc shell ${CONTAINER_NAME} -- ${SHELL} -c "systemctl enable ssh; reboot"


PROXY_NAME="honeypot_ssh_proxy" sudo lxc config device add ${CONTAINER_NAME} ${PROXY_NAME} proxy listen=tcp:0.0.0.0:22 connect=tcp:0.0.0.0:22
