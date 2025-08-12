# Medication Manager UI

## Setup

After generating a secure api key for the [Medication Manager Lambda](https://github.com/micahwierenga/medication-manager-lambda), set this key as the value of `API_KEY` in the `src/api/patients.ts` module.

And, once a **Function URL** has been configured for the Lambda service, set it as the value of `BASE_URL` in the `src/api/patients.ts` module.

Run the following commands:

```
npm install
npm run dev
```
