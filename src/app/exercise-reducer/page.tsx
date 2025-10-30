"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createContext, use, useReducer, useState } from "react";
import { FlightOption, getFlightOptions } from "@/app/exerciseUtils";

interface SearchResultsProps {
  flightOptions: FlightOption[];
  passengers: number;
  onBack: () => void;
}

type BookingState = {
  status: "idle" | "searching" | "error" | "results" | "submit";
  flightOptions: FlightOption[] | null;
  searchParams: {
    destination: string;
    departure: string;
    arrival: string;
    passengers: number;
    isOneWay: boolean;
  } | null;
};

const initialBookingState: BookingState = {
  status: "idle",
  flightOptions: null,
  searchParams: null,
};

type BookingAction =
  | {
      type: "submit";
      payload: {
        destination: string;
        departure: string;
        arrival: string;
        passengers: number;
        isOneWay: boolean;
      };
    }
  | { type: "results"; flightOptions: FlightOption[] }
  | { type: "back" }
  | { type: "error" };

const bookingReducer = (
  state: BookingState,
  action: BookingAction
): BookingState => {
  switch (action.type) {
    case "submit":
      return {
        ...state,
        status: "submit",
        searchParams: action.payload,
      };
    case "results":
      return {
        ...state,
        status: "results",
        flightOptions: action.flightOptions,
      };
    case "back":
      if (state.status === "results") {
        return {
          ...state,
          status: "idle",
        };
      } else {
        return state;
      }
    case "error":
      return {
        ...state,
        status: "error",
      };
    default:
      return state;
  }
};

function SearchResults({
  flightOptions,
  passengers,
  onBack,
}: SearchResultsProps) {
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(
    null
  );
  const totalPrice = selectedFlight ? selectedFlight.price * passengers : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Search Results</h2>
        <Button variant="outline" onClick={onBack}>
          Back to Search
        </Button>
      </div>

      <div className="space-y-4">
        {flightOptions.map((flight) => (
          <div
            key={flight.id}
            className={`p-4 border rounded hover:shadow-md ${
              selectedFlight?.id === flight.id
                ? "border-blue-500 bg-blue-50"
                : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{flight.airline}</h3>
                <p className="text-gray-600">Duration: {flight.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">${flight.price}</p>
                <Button
                  className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  onClick={() => setSelectedFlight(flight)}
                >
                  {selectedFlight?.id === flight.id ? "Selected" : "Select"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedFlight && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
          <div className="space-y-2">
            <p>Flight: {selectedFlight.airline}</p>
            <p>Duration: {selectedFlight.duration}</p>
            <p>Passengers: {passengers}</p>
            <p className="text-xl font-bold mt-4">Total: ${totalPrice}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingForm() {
  const { dispatch, state } = use(BookingContext);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const bookingData = Object.fromEntries(formData);

    dispatch({
      type: "submit",
      payload: bookingData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" name="booking-form">
      <div className="flex items-center space-x-2 mb-4">
        <Switch id="one-way" />
        <Label htmlFor="one-way">One-way flight</Label>
      </div>

      <div>
        <Label htmlFor="destination" className="block mb-1">
          Destination
        </Label>
        <Input type="text" id="destination" required />
      </div>

      <div>
        <Label htmlFor="departure" className="block mb-1">
          Departure Date
        </Label>
        <Input type="date" id="departure" required />
      </div>

      {!state.searchParams?.isOneWay && (
        <div>
          <Label htmlFor="arrival" className="block mb-1">
            Return Date
          </Label>
          <Input type="date" id="arrival" required />
        </div>
      )}

      <div>
        <Label htmlFor="passengers" className="block mb-1">
          Number of Passengers
        </Label>
        <Input type="number" id="passengers" min="1" max="9" required />
      </div>

      <Button
        type="submit"
        disabled={state.status === "searching"}
        className="w-full"
      >
        {state.status === "searching" ? "Searching..." : "Search Flights"}
      </Button>
    </form>
  );
}

const BookingContext = createContext<{
  state: BookingState;
  dispatch: (action: BookingAction) => void;
}>({
  state: initialBookingState,
  dispatch: () => {},
});

const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};

const BookingContent = () => {
  const { state, dispatch } = use(BookingContext);
  const handleSubmit = async (formData) => {
    try {
      dispatch({ type: "submit", payload: formData });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockFlights = await getFlightOptions(formData);
      dispatch({ type: "results", flightOptions: mockFlights });
    } catch {
      dispatch({ type: "error" });
    }
  };
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Flight Booking</h1>

      {state.status !== "results" ? (
        <>
          <BookingForm onSubmit={handleSubmit} />
          {state.status === "error" && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              An error occurred while searching for flights. Please try again.
            </div>
          )}
        </>
      ) : (
        <SearchResults
          flightOptions={state.flightOptions ?? []}
          passengers={state.searchParams?.passengers ?? 1}
          onBack={() => dispatch({ type: "back" })}
        />
      )}
    </div>
  );
};

export default function Page() {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  );
}
