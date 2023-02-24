/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import client from 'prom-client';

export const metric_ledger_height = new client.Gauge({
	name: 'metric_ledger_height',
	help: 'metric_ledger_height_low: returns ledger height of the peer nodes',
	labelNames: ['channel', 'mspid', 'requests', 'server_hostname']
});

export const metric_channel_height = new client.Gauge({
	name: 'metric_channel_height',
	help: 'metric_channel_height: returns block height of channel',
	labelNames: ['channel', 'channel_genesis_hash']
});

export const metric_channel_transaction_count = new client.Gauge({
	name: 'metric_channel_transaction_count',
	help: 'metric_channel_txns: returns transaction count on a channel',
	labelNames: ['channel', 'channel_genesis_hash']
});
