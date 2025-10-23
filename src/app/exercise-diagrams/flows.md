# Entity relationship

- destinations
  - id integer [primary key]
  - userId string
- homes
  - id integer [primary key]
  - title varchar
  - body text
  - createdAt timestamp
  - destinationId integer
- users

  - id integer [primary key]
  - name varchar
  - createdAt timestamp

  Ref homes.destination.id > destination.id // one destination - many homes
  Ref destinations.userId > users.id // one user - many directions

# Sequence diagram

User/UI -> Search Service: Search destinations (location, dates, guests)
Search Service -> AirBnB API: Request available destinations
AirBnB API -> Search Service: Return destinations list
Search Service -> UI: Display destination options

User/UI -> Search Service: Select destination
Search Service -> AirBnB API: Get available homes for destination
AirBnB API -> Search Service: Return list of homes
Search Service -> UI: Display homes list

User/UI -> AirBnB API: Select home & initiate booking
AirBnB API -> Payment Processor: Process payment
Payment Processor -> AirBnB API: Payment success
AirBnB API -> UI: Booking confirmed

# State diagram

Start with destination
When the destination si input, put in the check in date
Then put in the checkout date
Then add the number of guests
And then when the user presses search, it'll take us to a search results page
The search results will be loading, and eventually show up
The user can click on one of the homes and be taken to a details page
They can go back from the details page back to the search page
