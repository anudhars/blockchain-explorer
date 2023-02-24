/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import { helper } from '../common/helper';
import { Proxy } from '../platform/fabric/Proxy';
import { Platform } from '../platform/fabric/Platform';
import {
	metric_ledger_height,
	metric_channel_height,
	metric_channel_transaction_count
} from './promMetrics';

const logger = helper.getLogger('dataFetcher');
export async function collectMetrics(platform: Platform) {
	logger.info('collecting metrics');

	const proxy: Proxy = platform.getProxy();

	// get the list of networks
	// This will provide fabric network details from /app/platform/fabric/connection-profile/test-network.json
	const networks = await proxy.networkList();
	for (const network of networks) {
		const network_id = network.id;
		// get all the channels info
		const channelList = await proxy.getChannelsInfo(network_id);
		for (const channelInfo of channelList) {
			const channel_genesis = channelInfo.channel_genesis_hash;
			metric_channel_height
				.labels({
					channel: channelInfo.channelname,
					channel_genesis_hash: channelInfo.channel_genesis_hash
				})
				.set(channelInfo.blocks);
			metric_channel_transaction_count
				.labels({
					channel: channelInfo.channelname,
					channel_genesis_hash: channelInfo.channel_genesis_hash
				})
				.set(channelInfo.transactions);

			// get the peer status and the ledger height
			const peerStatus = await proxy.getPeersStatus(network_id, channel_genesis);

			for (const peer of peerStatus) {
				if (
					peer.peer_type === 'PEER' &&
					typeof peer.ledger_height_low === 'number'
				) {
					metric_ledger_height
						.labels({
							mspid: peer.mspid,
							requests: peer.requests,
							server_hostname: peer.server_hostname,
							channel: channelInfo.channelname
						})
						.set(peer.ledger_height_low);
				}
			}
		}
	}
}
