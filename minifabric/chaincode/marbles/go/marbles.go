package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	peer "github.com/hyperledger/fabric-protos-go/peer"
)

/*
###############
### Marbles ###
###############
*/

// MarblesChaincode struct.
type MarblesChaincode struct {
}

// Marbles struct
type marble struct {
	Owner      string `json:"owner"`
	Color      string `json:"color"`
	Size       int    `json:"size"`
}

/*
###################################
### Chaincode Default Functions ###
###################################
*/

// Init function.
func (m *MarblesChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

// Invoke function.
func (m *MarblesChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()

	switch fn {

	case "AddMarble":
		i, err := strconv.Atoi(args[2])
		if err != nil {
			return shim.Error(err.Error())
		}
		err = addMarble(stub, args[0], args[1], i)
		if err != nil {
			return shim.Error(err.Error())
		}

		return shim.Success([]byte(nil))

	case "GetAllMarbles":
		result, err := getAllMarbles(stub)
		if err != nil {
			return shim.Error(err.Error())
		}

		resultBytes, err := json.Marshal(result)
		if err != nil {
			return shim.Error("Can't marshal result | "+err.Error())
		}

		return shim.Success(resultBytes)

	case "GetMarble":
		result, err := getMarble(stub, args[0], args[1])
		if err != nil {
			return shim.Error(err.Error())
		}

		resultBytes, err := json.Marshal(result)
		if err != nil {
			return shim.Error("Can't marshal result | "+err.Error())
		}

		return shim.Success(resultBytes)

	default:
		return shim.Error("Function doesn't exist")
	}
}

func main() {
	if err := shim.Start(new(MarblesChaincode)); err != nil {
		log.Panicf("Erro ao tentar iniciar a chaincode marbles: %v", err)
	}
}

/*
#########################
### Marbles Functions ###
#########################
*/

/*
#############
### Write ###
#############
*/

// Add marble to collection
func addMarble(stub shim.ChaincodeStubInterface, owner string, color string, size int) error {
	marble := &marble{
		Owner: owner,
		Color: color,
		Size:  size,
	}

	marbleBytes, err := json.Marshal(marble)
	if err != nil {
		return fmt.Errorf("Can't create marble bytes | "+err.Error())
	}

	marbleID := owner+"-"+color

	err = stub.PutState(marbleID, []byte(marbleBytes))
	if err != nil {
		return fmt.Errorf("Can't update world state | "+err.Error())
	}
	return nil
}

/*
############
### Read ###
############
*/ 

// Return all marbles
func getAllMarbles(stub shim.ChaincodeStubInterface) ([]marble, error) {
	marbleIterator, err := stub.GetStateByRange("", "")
	if err != nil {
		return nil, fmt.Errorf("Can't get world state | "+err.Error())
	}

	var marbles []marble

	defer marbleIterator.Close()
	for marbleIterator.HasNext() {
		queryResponse, err := marbleIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("Can't get next marble | "+err.Error())
		}
		var marble marble
		err = json.Unmarshal(queryResponse.Value, &marble)
		if err != nil {
			return nil, fmt.Errorf("Can't get marble info | "+err.Error())
		}
		marbles = append(marbles, marble)
	}

	return marbles, nil
}

// Return a specific marble
func getMarble(stub shim.ChaincodeStubInterface, owner string, color string) (*marble, error) {
	marbleID := owner+"-"+color
	marbleBytes, err := stub.GetState(marbleID)
	if err != nil {
		return nil, fmt.Errorf("Can't get world state | "+err.Error())
	}

	var marble marble
	err = json.Unmarshal(marbleBytes, &marble)
	if err != nil {
		return nil, fmt.Errorf("Can't get marble info | "+err.Error())
	}

	return &marble, nil
}