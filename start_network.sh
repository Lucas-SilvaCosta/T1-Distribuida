#!/bin/bash

print_options() {
    printf "Opções disponíveis:
    -b : Realiza o build da imagem da rede blockchain"
}

sudo echo "Inicializando instalação"

BLUE='\033[0;34m'
CLR='\033[0m'

# Get optional parameters.
while getopts 'b' flag; do
    case "${flag}" in
    b) build=true ;;
    *) print_options
        exit 1 ;;
    esac
done

PROJECT=$(pwd)
echo -e "${BLUE}==> PROJECT PATH = ${PROJECT}${CLR}"

# Checks if there is already a acadblock installation.
if [ -d "$MINIFAB_PATH/vars" ]; then
	if [ "$(ls -A $MINIFAB_PATH/vars)" ]; then
        echo "Já existe uma instalação da rede em $MINIFAB_PATH. Você deseja removê-la e prosseguir com a instalação? (y/n)"
        read answer
        if [ "$answer" = "n" ]; then
            exit
        else
            cd $MINIFAB_PATH
            ./minifab cleanup
        fi
	fi
fi

# sudo apt-get install docker-compose-plugin

# Copy chaincodes and applications to minifabric.
cd $PROJECT
sudo rm -rf minifabric/chaincode/marbles
cp -R chaincode/* minifabric/chaincode
sudo rm -rf minifabric/app/gatekeeper
cp -R application/* minifabric/app

echo -e "${BLUE}====================="
echo "Setting up chaincodes"
echo -e "=====================${CLR}"

# Initialize go modules and prepare chaincodes for installation.
cp ./modules.sh ./minifabric/chaincode
cd ./minifabric/chaincode
docker run --rm -v "$(pwd)":/go/chaincode golang:1.19.3-alpine /bin/sh ./chaincode/modules.sh

cd $PROJECT

cd minifabric

if [ "$build" = true ]; then
    echo "Construindo imagem da rede"
    docker build -t distribuida .
fi

# Initialize base network.
echo -e "${BLUE}===================="
echo "Inicializando a rede"
echo -e "====================${CLR}"

cd $MINIFAB_PATH
cp $PROJECT/minifabric/minifab $MINIFAB_PATH
mkdir $MINIFAB_PATH/vars
cp -R $PROJECT/minifabric/chaincode $MINIFAB_PATH/vars
cp -R $PROJECT/minifabric/app $MINIFAB_PATH/vars

cd $MINIFAB_PATH/vars/chaincode
sudo rm -rf modules.sh

cd $MINIFAB_PATH
./minifab up -e true || exit $?
sudo chown -R $USER:$(id -u) $MINIFAB_PATH

# Initialize Applications.
cd $MINIFAB_PATH
echo -e "${BLUE}=========================="
echo "Inicializando Applications"
echo -e "==========================${CLR}"

cd $MINIFAB_PATH
./minifab appmarbles || exit $?

# Initialize APIs.
echo -e "${BLUE}=============="
echo "Iniciando APIs"
echo -e "==============${CLR}"

cd $PROJECT

docker-compose up --build -d
