#!/bin/bash

cd chaincode
cd marbles/go
go mod init marbles.go
go mod tidy
go mod vendor