# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
    # The most common configuration options are documented and commented below.
    # For a complete reference, please see the online documentation at
    # https://docs.vagrantup.com.
  
    # Every Vagrant development environment requires a box. You can search for
    # boxes at https://vagrantcloud.com/search.
    config.vm.box = "ubuntu/bionic64"
  
    config.vm.define "ubuntu" do | ubuntu |
      ubuntu.vm.network "private_network", ip: "192.168.6.100"
      ubuntu.vm.hostname = "ubuntu"
    end
  
  
    config.ssh.insert_key = false
    config.ssh.private_key_path = ["~/.ssh/id_rsa", "~/.vagrant.d/insecure_private_key"]
    config.ssh.forward_agent = true  
    config.vm.provision "file", source: "~/.ssh/id_rsa.pub", destination: "~/.ssh/authorized_keys" 
    config.vm.synced_folder ".", "/vagrant"
  end