## ADDED Requirements

### Requirement: Create Pool button navigates to setup form

The "Create Pool" button in `MainMenu` SHALL navigate the user to the name/description setup form. No pool record is created at this point.

#### Scenario: User clicks Create Pool

- **WHEN** an authenticated user clicks the "Create Pool" button in `MainMenu`
- **THEN** the app renders the `PoolSetupPage` (name/description form)

### Requirement: Pool setup form collects name and description

The `PoolSetupPage` SHALL present a form with a required pool name field and an optional description field.

#### Scenario: Form renders with empty fields

- **WHEN** `PoolSetupPage` is rendered
- **THEN** a text input for pool name and a textarea for description are shown, both initially empty

#### Scenario: Submit is disabled without a name

- **WHEN** the pool name field is empty
- **THEN** the submit button SHALL be disabled

### Requirement: Submitting the form creates the pool and navigates to the contract screen

On valid submission, `PoolSetupPage` SHALL call the Convex `createPool` mutation with the entered name, description, and the creator's wallet address as `founderName`. On success it SHALL navigate the user into `PoolDashboard` starting on the `create-contract` view.

#### Scenario: Successful pool creation

- **WHEN** the user fills in a pool name and clicks submit
- **THEN** `createPool` is called with the name, optional description, and wallet as founderName
- **THEN** on success the app navigates to `PoolDashboard` with `initialView="create-contract"` for the new pool

#### Scenario: Back navigation from setup form

- **WHEN** the user clicks the back button on `PoolSetupPage`
- **THEN** the app navigates back to `MainMenu` and no pool record is created

### Requirement: createPool mutation accepts an optional description

The Convex `createPool` mutation SHALL accept an optional `description` argument and persist it to the `pools` table.

#### Scenario: Pool created with description

- **WHEN** `createPool` is called with a name and description
- **THEN** the new pool document SHALL have the provided name and description

#### Scenario: Pool created without description

- **WHEN** `createPool` is called without a description
- **THEN** the new pool document SHALL have the provided name and no description field

### Requirement: pools schema includes an optional description field

The `pools` table in the Convex schema SHALL include `description: v.optional(v.string())`.

#### Scenario: Schema accepts pools with and without description

- **WHEN** a pool is inserted with a description value
- **THEN** it is stored without error
- **WHEN** a pool is inserted without a description value
- **THEN** it is also stored without error
