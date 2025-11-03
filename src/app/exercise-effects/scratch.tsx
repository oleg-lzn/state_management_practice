"use client";

import { useEffect, useReducer } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Flight {
  id: string;
  price: number;
  airline: string;
  departureTime: string;
  arrivalTime: string;
}

interface Hotel {
  id: string;
  name: string;
  price: number;
  rating: number;
}

const initialState: FlightState = {
  inputs: {
    destination: "",
    startDate: "",
    endDate: "",
  },
  status: "idle",
  selectedFlight: null,
  selectedHotel: null,
  error: null,
};

type FlightState = {
  inputs: {
    destination: "";
    startDate: "";
    endDate: "";
  };
  status:
    | "idle"
    | "searchingFlights"
    | "searchingHotels"
    | "flightSelected"
    | "hotelSelected"
    | "error";
  selectedFlight: Flight | null;
  selectedHotel: Hotel | null;
  error: string | null;
};

type Action =
  | {
      type: "inputUpdated";
      payload: {
        inputs: { destination: string; startDate: string; endDate: string };
      };
    }
  | {
      type: "flightUpdated";
      payload: { flight: Flight };
    }
  | { type: "hotelUpdated"; payload: { hotel: Hotel } }
  | { type: "error"; payload: { error: string } };

const flightReducer = (state: FlightState, action: Action): FlightState => {
  switch (action.type) {
    case "inputUpdated":
      const inputs = {
        ...state.inputs,
        ...action.payload.inputs,
      };
      if (inputs.destination && inputs.startDate && inputs.endDate) {
        return {
          ...state,
          status: "searchingFlights",
        };
      }
    case "flightUpdated":
      return {
        ...state,
        selectedFlight: action.payload.flight,
        status: "searchingHotels",
      };
    case "hotelUpdated":
      return {
        ...state,
        selectedHotel: action.payload.hotel,
        status: "idle",
      };
    case "error":
      return {
        ...state,
        status: "error",
      };
    default:
      return state;
  }
};

const useTripSearch = (): [FlightState, (action: Action) => void] => {
  const [state, dispatch] = useReducer(flightReducer, initialState);
  useEffect(() => {
    const { destination, startDate, endDate } = state.inputs;
    const { status } = state;

    // Only proceed if we have all required inputs
    if (!destination || !startDate || !endDate) return;

    // Handle flight search
    if (status === "searchingFlights") {
      const searchFlights = async () => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock flight data
          const flights: Flight[] = [
            {
              id: "1",
              price: 299,
              airline: "Mock Airlines",
              departureTime: "10:00 AM",
              arrivalTime: "2:00 PM",
            },
            {
              id: "2",
              price: 399,
              airline: "Demo Airways",
              departureTime: "2:00 PM",
              arrivalTime: "6:00 PM",
            },
          ];

          // Pick the cheapest flight
          const bestFlight = flights.reduce((prev, current) =>
            prev.price < current.price ? prev : current
          );

          dispatch({ type: "flightUpdated", payload: { flight: bestFlight } });
        } catch {
          dispatch({
            type: "error",
            payload: { error: "Failed to search flights" },
          });
        }
      };

      searchFlights();
    }

    // Handle hotel search
    if (status === "searchingHotels") {
      const searchHotels = async () => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Mock hotel data
          const hotels: Hotel[] = [
            {
              id: "1",
              name: "Grand Hotel",
              price: 150,
              rating: 4.5,
            },
            {
              id: "2",
              name: "Budget Inn",
              price: 80,
              rating: 3.8,
            },
          ];

          // Pick the best rated hotel
          const bestHotel = hotels.reduce((prev, current) =>
            prev.rating > current.rating ? prev : current
          );

          dispatch({ type: "hotelUpdated", payload: { hotel: bestHotel } });
        } catch {
          dispatch({
            type: "error",
            payload: { error: "Failed to search hotels" },
          });
        }
      };

      searchHotels();
    }
  }, [state]);

  return [state, dispatch];
};

export default function TripSearch() {
  const [state, dispatch] = useTripSearch();

  return (
    <div className="p-8 w-full max-w-2xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Search Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              onBlur={(e) =>
                dispatch({
                  type: "inputUpdated",
                  payload: {
                    inputs: {
                      destination: e.target.value.trim(),
                      startDate: state.inputs.startDate,
                      endDate: state.inputs.endDate,
                    },
                  },
                })
              }
              placeholder="Enter destination"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={state.inputs.startDate}
              onChange={(e) =>
                dispatch({
                  type: "inputUpdated",
                  payload: {
                    inputs: {
                      destination: state.inputs.destination,
                      startDate: e.target.value,
                      endDate: state.inputs.endDate,
                    },
                  },
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={state.inputs.endDate}
              onChange={(e) =>
                dispatch({
                  type: "inputUpdated",
                  payload: {
                    inputs: {
                      destination: state.inputs.destination,
                      startDate: state.inputs.startDate,
                      endDate: e.target.value,
                    },
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {state.error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {state.error}
        </div>
      )}

      <div className="space-y-6">
        <Card
          className={state.status === "searchingFlights" ? "opacity-50" : ""}
        >
          <CardHeader>
            <CardTitle>Flight Search</CardTitle>
          </CardHeader>
          <CardContent>
            {state.status === "searchingFlights" ? (
              <p>Searching for flights...</p>
            ) : state.selectedFlight ? (
              <div className="space-y-2">
                <p className="font-medium">Selected Flight:</p>
                <p>Airline: {state.selectedFlight.airline}</p>
                <p>Price: ${state.selectedFlight.price}</p>
                <p>Departure: {state.selectedFlight.departureTime}</p>
                <p>Arrival: {state.selectedFlight.arrivalTime}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card
          className={state.status === "searchingHotels" ? "opacity-50" : ""}
        >
          <CardHeader>
            <CardTitle>Hotel Search</CardTitle>
          </CardHeader>
          <CardContent>
            {state.status === "searchingHotels" ? (
              <p>Searching for hotels...</p>
            ) : state.selectedHotel ? (
              <div className="space-y-2">
                <p className="font-medium">Selected Hotel:</p>
                <p>Name: {state.selectedHotel.name}</p>
                <p>Price: ${state.selectedHotel.price}/night</p>
                <p>Rating: {state.selectedHotel.rating}/5</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
