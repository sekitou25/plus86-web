# plumber

Language: en
Body language: en

[Interactive edition](/?lang=en#/work/plumber) · [HTML](/read/en/work/plumber.html)

Research and implementation of an automated trading agent

A personal project in development: strategy research, backtesting, IBKR execution, separate ledgers, and local monitoring.

## Metadata

- **Company**: Personal project

- **My role**: Strategy research & system development

- **Project period**: In progress

- **Technology & focus**: Python / IBKR / Strategy research / Execution & monitoring

- **Category**: AI & trading

- Research & backtesting

- Execution & reconciliation

- Local monitoring

plumber

- Research / Signal

- Risk checks

- Execute / Reconcile

## Project overview

- **Execution adapter**: IBKR

- **Strategy and environment isolation**: Separate ledgers

- **Status, fills, and logs**: Local monitoring

## Scope

plumber is an automated trading AI agent in development. It includes research, backtesting, execution, separate ledgers, reconciliation, and local monitoring.

Research covers risk parity, statistical arbitrage, bond seasonality, and order flow. Each strategy needs a record of its return hypothesis, costs, execution constraints, and parameter choices.

## Research and execution

Research notebooks are separated from the execution layer. Shared infrastructure covers IBKR integration, connection heartbeats, safe execution, separate ledgers, and audit records. Configuration and runtime state are isolated by strategy and trading environment.

The system records signal calculations, orders, fills, and reconciliation for investigating execution differences.

## Monitoring

Building a local monitoring interface for strategy status, positions, equity, fills, and redacted logs. Monitoring is separated from trading services, with explicit environment selection and stop mechanisms.

## Open questions

Continue checking the effects of costs, fill deviations, and execution failures. The system remains in development; an implementation does not establish strategy validity or imply a return guarantee.
