## Importing groups

#### Description

In case the camps department decides to use an external tool for registering camps (e.g Google Sheets) we want a way to import all camps to our db.

#### Usage

Look at import-example.csv for an example importing file (csv must be utf-8 encoded and without empty rows - will kill the browser).
A route was added at /camps/management/import and contains a simple file input for adding the camps to DB via create group api.

#### Development

Make sure to add columns to migration and parsing process (if needed) under [ImportGroup component](../../src/components/groups/ImportGroup.js)

#### Formatting

We need to make sure we format the excel correctly for the DB to handle the data (ENUMS and etc..) (e.g noise level)

#### Roadmap

[] Infer tags from CSV (Save in different DB)
