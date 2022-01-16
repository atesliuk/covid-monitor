# Development setup

-   Create a .env file in the root of the project and add the following fields:

```
PORT=8080
MONGO_USER=YOUR_MONGODB_USERNAME
MONGO_PASSWORD=YOUR_MONGODB_PASSWORD
MONGO_DB_NAME=covid-monitor-daily-production
COVID_DATA_UPDATE_INTERVAL=6
COVID_DATA_URL=https://corona-virus-world-and-india-data.p.rapidapi.com/api
COVID_DATA_X_RAPIDAPI_KEY=<ask admin>
COVID_DATA_X_RAPIDAPI_HOST=corona-virus-world-and-india-data.p.rapidapi.com
SESSION_SECRET=YBs5u5KbUpfZXq8V
```

# Covid data API Provider

-   See documentation here:
    https://english.api.rakuten.net/spamakashrajtech/api/corona-virus-world-and-india-data/endpoints
