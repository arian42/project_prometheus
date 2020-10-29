# Setup the server.py

## First install Python 3

### Linux

serach for you distero your package manager 
install both Python and Pip
on Ubuntu:

```
sudo apt update
sudo apt install python3 python3-pip

```

### Windows

go to [Python website] (https://www.python.org/) download and install

## Install Virtualenv

### Linux 

you can install it with package manager or pip

#### with pip

    pip install virtualenv

extra info on [this link] (https://gist.github.com/frfahim/73c0fad6350332cef7a653bcd762f08d)

## Create virtual environment

    virtualenv myenv

this will create a directory called myenv in your CWD
becarefull to not put this directory inside git

## Activate virtual enciroment

you need this step every time you want to run the server

    source ./myenv/bin/activate

## Install flask

Flask is a webserver

    pip install flask

## Finally

now you can run the server
go to backend then run the server.py with python

    python ./server.py



