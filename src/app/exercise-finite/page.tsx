"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { getFlightOptions } from "@/app/exerciseUtils";

interface FlightOption {
  id: string;
  airline: string;
  price: number;
  duration: string;
}

function FlightBooking() {
  const [flight, setFlight] = useState({
    destination: "",
    departure: "",
    arrival: "",
    passengers: 1,
    isRoundtrip: false,
    id: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "submitted" | "error"
  >("idle");

  const [flightOptions, setFlightOptions] = useState<FlightOption[]>([]);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const { destination, departure, arrival, passengers } = flight;

    try {
      const flights = await getFlightOptions({
        destination,
        departure,
        arrival,
        passengers,
      });

      setFlightOptions(flights);
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  };

  const selectedFlight = flightOptions.find((f) => f.id === selectedFlightId);
  const { airline, duration, passengers, price } = selectedFlight;
  const totalPrice = price * passengers;

  const handleFlightSelect = (id: string) => {
    setSelectedFlightId(id);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlight((prev) => ({
      ...prev,
      destination: e.target.value,
    }));
  };

  const handleRoundtripChange = (checked: boolean) => {
    setFlight((prev) => ({
      ...prev,
      isRoundtrip: checked ? true : false,
    }));
  };

  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlight((prev) => ({
      ...prev,
      departure: e.target.value,
    }));
  };

  const handleArrivalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlight((prev) => ({
      ...prev,
      arrival: e.target.value,
    }));
  };

  const handlePassengersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlight((prev) => ({
      ...prev,
      passengers: Number(e.target.value),
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Flight Booking</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="roundtrip"
            checked={flight.isRoundtrip}
            onCheckedChange={handleRoundtripChange}
          />
          <Label htmlFor="roundtrip">Roundtrip flight</Label>
        </div>

        <div>
          <Label htmlFor="destination" className="block mb-1">
            Destination
          </Label>
          <Input
            type="text"
            id="destination"
            value={flight.destination}
            onChange={handleDestinationChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="departure" className="block mb-1">
            Departure Date
          </Label>
          <Input
            type="date"
            id="departure"
            value={flight.departure}
            onChange={handleDepartureChange}
            required
          />
        </div>

        {flight.isRoundtrip && (
          <div>
            <Label htmlFor="arrival" className="block mb-1">
              Return Date
            </Label>
            <Input
              type="date"
              id="arrival"
              value={flight.arrival}
              onChange={handleArrivalChange}
              required
            />
          </div>
        )}

        <div>
          <Label htmlFor="passengers" className="block mb-1">
            Number of Passengers
          </Label>
          <Input
            type="number"
            id="passengers"
            value={flight.passengers}
            onChange={handlePassengersChange}
            min="1"
            max="9"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="w-full"
        >
          {status === "submitting" ? "Searching..." : "Search Flights"}
        </Button>
      </form>

      {status === "error" && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          An error occurred while searching for flights. Please try again.
        </div>
      )}

      {status === "submitted" && flightOptions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Available Flights</h2>
          <div className="space-y-4">
            {flightOptions.map(({ id, airline, duration, price }) => (
              <div
                key={id}
                className={`p-4 border rounded hover:shadow-md ${
                  selectedFlight?.id === id ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{airline}</h3>
                    <p className="text-gray-600">Duration: {duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">${price}</p>
                    <Button
                      className="mt-2 bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                      onClick={() => handleFlightSelect(id)}
                    >
                      {selectedFlight?.id === id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFlight && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
          <div className="space-y-2">
            <p>Flight: {airline}</p>
            <p>Duration: {duration}</p>
            <p>Passengers: {passengers}</p>
            <p className="text-xl font-bold mt-4">Total: ${totalPrice}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <FlightBooking />;
}
