import {gql} from "@apollo/client";

export const CREATE_TAXI = gql`
 mutation CreateTaxi($driverName: String!, $licensePlate: String!, $carNumber: String!, $latitude: Float!, $longitude: Float!) {
 createTaxi(input: {driverName: $driverName, licensePlate: $licensePlate, carNumber: $carNumber, latitude: $latitude, longitude: $longitude}) {
    driverName
    id
    isAvailable
    licensePlate
    carNumber
 }
 }
`