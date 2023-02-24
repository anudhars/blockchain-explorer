/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import { Express } from 'express';
import promClient from 'prom-client';
import { helper } from '../common/helper';
import { collectMetrics } from './dataFetcher';

export async function metricRoutes(app: Express, platform: any) {
	const logger = helper.getLogger('metricRoutes');

	const prefix = 'explorer_';
	const collectDefaultMetrics = promClient.collectDefaultMetrics;
	const Registry = promClient.Registry;
	const register = new Registry();
	collectDefaultMetrics({ register, prefix });

	// scrap metrics for every 5 seconds
	setInterval(() => {
		collectMetrics(platform);
	}, 5 * 1000);

	app.get('/metrics', async (_, res) => {
		logger.info('available metrics....');
		res.send(await promClient.register.metrics());
	});
}
