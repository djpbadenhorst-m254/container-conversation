# README
This repository contains code for the conversation server.

## BUILD DOCKER IMAGE
In order to build the conversation server docker image , simply run the following script:

```
git clone git@github.com:moneyafrica/nodelib-m254-utils.git
bash build.sh
```

## RUN DOCKER IMAGE
In order to deploy the conversation server and its dependencies, you can consider the following repo:
https://github.com/moneyafrica/ansible-local-deploy

### PUSH DOCKER IMAGE
To push the image to GCP container registry, run the following lines in terminal:

```
gcloud auth login
source ./version
gcloud auth print-access-token | docker login https://gcr.io -u oauth2accesstoken --password-stdin
docker tag conversation gcr.io/m254-registry-f3e3/conversation:$REPO_VERSION
docker push gcr.io/m254-registry-f3e3/conversation:$REPO_VERSION
```

### DEPLOY IN STAGING
To deploy a new image in staging, run the following:

```
gcloud --project=m254-maverick-stg-infras-c7fa run services update m254-maverick-stg-conversation --region=europe-west1 --image=gcr.io/m254-registry-f3e3/conversation:$REPO_VERSION
```

### DEPLOY IN PRODUCTION
To deploy a new image in production, run the following:

```
gcloud --project=m254-maverick-prd-infras-20c8 run services update m254-maverick-prd-conversation --region=europe-west1 --image=gcr.io/m254-registry-f3e3/conversation:$REPO_VERSION
```

## UNIT TESTS
To run the unit test, run the following.

```
npm run tests
```

# TODO
Usefull API calls
```
curl -H 'Content-Type: application/json' -X POST 'https://m254-maverick-prd-conversation-rroh4i7zwa-ew.a.run.app/conversations/finqual' -d '{ "phone_number":"+27734699556", "first_name":"Dirk", "product_category":"Secured Business Loan", "entrypoint": "Facebook" }'

Entry Point: Website
Campaign:
Name: Adam Versprille
Product: Logbook Loan
Loan Amount: 100,000
Vehicle Make / Model (String): Toyota (could be junk)
Consent Given: Yes
Initiating Channel: Whatsapp, if Whatsapp fails to deliver, SMS
```
