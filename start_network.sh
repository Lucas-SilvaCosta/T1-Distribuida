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

# Copy errorHandling files to applications.
# cp -R utils/errorHandling/js/* minifabric/app/academicRecords/main/utils
# cp -R utils/errorHandling/js/* minifabric/app/decree/main/utils
# cp -R utils/errorHandling/js/* minifabric/app/regulation/main/utils
# cp -R utils/errorHandling/js/* minifabric/app/xmlog/main/utils
# cp -R utils/errorHandling/js/* minifabric/app/diploma/main/utils

# Move helper to each application
# cp -R application/utils/* minifabric/app/academicRecords/main/utils
# cp -R application/utils/* minifabric/app/decree/main/utils
# cp -R application/utils/* minifabric/app/xmlog/main/utils
# cp -R application/utils/* minifabric/app/regulation/main/utils
# cp -R application/utils/* minifabric/app/diploma/main/utils

echo -e "${BLUE}====================="
echo "Setting up chaincodes"
echo -e "=====================${CLR}"

# Initialize go modules and prepare chaincodes for installation.
cp ./modules.sh ./minifabric/chaincode
cd ./minifabric/chaincode
docker run --rm -v "$(pwd)":/go/chaincode golang:1.19.3-alpine /bin/sh ./chaincode/modules.sh

cd $PROJECT

# Copy errorMessages.go to chaincodes.
# sudo cp utils/errorHandling/go/errorMessages.go minifabric/chaincode/academicRecords/go/vendor/errorMessages
# sudo cp utils/errorHandling/go/errorMessages.go minifabric/chaincode/decree/go/vendor/errorMessages
# sudo cp utils/errorHandling/go/errorMessages.go minifabric/chaincode/regulation/go/vendor/errorMessages
# sudo cp utils/errorHandling/go/errorMessages.go minifabric/chaincode/XMLog/go/vendor/errorMessages
# sudo cp utils/errorHandling/go/errorMessages.go minifabric/chaincode/diploma/go/vendor/errorMessages

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
# cp $PROJECT/config/spec.yaml $MINIFAB_PATH
cp -R $PROJECT/minifabric/chaincode $MINIFAB_PATH/vars
cp -R $PROJECT/minifabric/app $MINIFAB_PATH/vars

cd $MINIFAB_PATH/vars/chaincode
# sudo rm -rf Dockerfile
sudo rm -rf modules.sh

cd $MINIFAB_PATH
./minifab up -e true || exit $?
sudo chown -R $USER:$(id -u) $MINIFAB_PATH

# Install chaincodes.
cd $MINIFAB_PATH
echo -e "${BLUE}====================="
echo Instalando chaincodes
echo -e "=====================${CLR}"

echo -e "${BLUE}=>Instalando chaincode Marbles${CLR}"
./minifab ccup -l go -n marbles -p '' || exit $?

# Initialize Applications.
echo -e "${BLUE}=========================="
echo "Inicializando Applications"
echo -e "==========================${CLR}"

cd $MINIFAB_PATH
./minifab appmarbles || exit $?

# Initialize APIs.
echo -e "${BLUE}=============="
echo "Iniciando APIs"
echo -e "==============${CLR}"

# Copia arquivos utils.
# cd $PROJECT
# cp -R api/utils api/academicRecords/api
# cp -R api/utils api/decree/api
# cp -R api/utils api/regulation/api
# cp -R api/utils api/diploma/api

# cp -R utils/errorHandling/js/* api/academicRecords/api/utils
# cp -R utils/errorHandling/js/* api/decree/api/utils
# cp -R utils/errorHandling/js/* api/regulation/api/utils
# cp -R utils/errorHandling/js/* api/diploma/api/utils

# cd scripts/certGenerator
# ./generateCerts.sh 'apis123'
# cd $PROJECT

# Copy certificates.
# cp -R scripts/certGenerator/academicRecords api/academicRecords/certs
# cp -R scripts/certGenerator/CA api/academicRecords/certs

# cp -R scripts/certGenerator/decree api/decree/certs
# cp -R scripts/certGenerator/CA api/decree/certs

# cp -R scripts/certGenerator/diploma api/diploma/certs
# cp -R scripts/certGenerator/CA api/diploma/certs

# cp scripts/certGenerator/decree/*.pem web/certs
# cp scripts/certGenerator/academicRecords/*.pem web/certs
# cp scripts/certGenerator/CA/*.pem web/certs
# cp scripts/certGenerator/apis-ca-crt.pem web/certs

# APIs docker files.
# cp docker/api/Dockerfile api/academicRecords
# cp docker/api/Dockerfile api/decree
# cp docker/api/Dockerfile api/regulation
# cp docker/api/Dockerfile api/diploma
# cp docker/web/Dockerfile web
# cp docker/ping/Dockerfile web/ping

cd $PROJECT

docker-compose up --build -d

# cd $PROJECT/scripts/checkStatus
# pip install -r requirements.txt
# python3 checkStatus.py

# cd $MINIFAB_PATH
# # Initialize Hyperledger Explorer
# ./minifab explorerup
