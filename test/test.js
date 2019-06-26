'use strict';
/* jshint ignore:start */

const {expect, use} = require('chai');
const {isInteger} = require('./helpers/util/utils');
const startInsightUI = require('./helpers/startInsightUI');
const wait = require('./helpers/util/wait');

let originalTimeout;

const topPanel = require('./helpers/pages/TopPanel');
const blockPage = require('./helpers/pages/BlockPage');
const statusPage = require('./helpers/pages/StatusPage');

describe('basic UI tests', () => {
    let masterNode;

    let url;
    let blockHash;
    let trxHash;

    beforeAll(async () => {
        [masterNode] = await startInsightUI.many(1);

        url = `http://127.0.0.1:${masterNode.insightUi.options.getUiPort()}/insight/`;

        await masterNode.dashCore.getApi().generate(15);

    });

    afterAll(async () =>{
        const instances = [
            masterNode,
        ];

        await Promise.all(instances.filter(i => i)
            .map(i => i.remove()));

    });

    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    describe('Home Page', () => {
        it('should be able to open main page', async () => {
            await browser.get(url);
            const title = await browser.getTitle();
            expect(title).equal('Home | Insight');
        });

        it('should be able to open block page', async () => {
            await topPanel.openBlockPage();
            const title = await browser.getTitle();
            expect(title).equal('Home | Insight');
        });

        it('should be able to open status page', async () => {
            await topPanel.openStatusPage();
            await wait(2000);
            const title = await browser.getTitle();
            expect(title).equal('Dash Blocks solved Today | Insight');

            const syncProgress = await statusPage.getSyncProgress();
            expect(syncProgress).equal("100% Complete");

            const currentSyncStatus = await statusPage.getCurrentSyncStatus();
            expect(currentSyncStatus).equal("finished");

            const startDate = await statusPage.getStartDate();
            expect(startDate).equal("Invalid date");

            const initialBlockChainHeight = await statusPage.getInitialBlockChainHeight();
            expect(isInteger(parseInt(initialBlockChainHeight))).equal(true);

            const syncedBlocks = await statusPage.getSyncedBlocks();
            expect(syncedBlocks).equal("");

            const skippedBlocks = await statusPage.getSkippedBlocks();
            expect(skippedBlocks).equal("");

            const syncType = await statusPage.getSyncType();
            expect(syncType).equal("bitcore node");

            const lastBlockHash = await statusPage.getLastBlockHash();
            console.log(`lastBlockHash: '${lastBlockHash}'`);
            expect(lastBlockHash).not.equal('');

            const currentBlockchainTip = await statusPage.getCurrentBlockchainTip();
            expect(currentBlockchainTip).not.equal("");

            const version = await statusPage.getVersion();
            expect(isInteger(parseInt(version))).equal(true);

            const protocolVersion = await statusPage.getProtocolVersion();
            expect(isInteger(parseInt(protocolVersion))).equal(true);

            const blocks = await statusPage.getBlocks();
            expect(blocks).equal("15");

            const timeOffset = await statusPage.getTimeOffset();
            expect(timeOffset).equal("0");

            const connections = await statusPage.getConnections();
            expect(connections).equal("0");

            const miningDifficulty = await statusPage.getMiningDifficulty();
            expect(miningDifficulty).not.equal("");

            const network = await statusPage.getNetwork();
            expect(network).equal('testnet');

            const proxySetting = await statusPage.getProxySetting();
            expect(proxySetting).equal("");

            const infoErrors = await statusPage.getInfoErrors();
            expect(infoErrors).equal("");
        });

        it('should be able search by block number', async () => {
            const blockIdToSearch = '12';

            topPanel.search(blockIdToSearch);
            const currentUrl = await browser.getCurrentUrl();
            expect(currentUrl).equal(`${url}block/${blockIdToSearch}`);

            const blockId = (await blockPage.getBlockId()).replace('Block #', '');
            expect(blockId).equal(blockIdToSearch);
            blockHash = await blockPage.getBlockHash();

            const numberOfTrxs = await blockPage.getNumberOfTrxs();
            expect(numberOfTrxs).equal("1");

            const height = await blockPage.getHeight();
            expect(height).equal(`${blockIdToSearch} (Mainchain)`);

            const blockReward = await blockPage.getBlockReward();
            expect(blockReward).equal('500 DASH');

            const timestamp = await blockPage.getTimestamp();
            expect(timestamp).not.equal("");
            const minedBy = await blockPage.getMinedBy();
            expect(minedBy).equal("");
            const merkleRoot = await blockPage.getMerkleRoot();
            expect(merkleRoot).not.equal("");
            const previousBlock = await blockPage.getPreviousBlock();
            expect(previousBlock).equal((parseInt(blockId) - 1) + '');
            const difficulty = await blockPage.getDifficulty();
            expect(difficulty).not.equal("");
            const bits = await blockPage.getBits();
            expect(bits).not.equal("");
            const size = await blockPage.getSize();
            expect(size).not.equal("");
            const version = await blockPage.getVersion();
            expect(isInteger(parseInt(version))).equal(true);
            const nonce = await blockPage.getNonce();
            expect(isInteger(parseInt(nonce))).equal(true);
            const nextBlock = await blockPage.getNextBlock();

            expect(nextBlock).equal((parseInt(blockId) + 1) + '');
            trxHash = await blockPage.getTrxHash();
        });

        it('should be able search by block hash', async () => {
            const blockIdToSearch = "12";
            topPanel.search(blockHash);
            const currentUrl = await browser.getCurrentUrl();
            expect(currentUrl).equal(`${url}block/${blockHash}`);

            const blockId = (await blockPage.getBlockId()).replace('Block #', '');
            expect(blockId).equal(blockIdToSearch);
            expect(await blockPage.getBlockHash()).equal(blockHash);

            const numberOfTrxs = await blockPage.getNumberOfTrxs();
            expect(numberOfTrxs).equal("1");

            const height = await blockPage.getHeight();
            expect(height).equal(`${blockIdToSearch} (Mainchain)`);

            const blockReward = await blockPage.getBlockReward();
            expect(blockReward).equal('500 DASH');

            const timestamp = await blockPage.getTimestamp();
            expect(timestamp).not.equal("");
            const minedBy = await blockPage.getMinedBy();
            expect(minedBy).equal("");
            const merkleRoot = await blockPage.getMerkleRoot();
            expect(merkleRoot).not.equal("");
            const previousBlock = await blockPage.getPreviousBlock();
            expect(previousBlock).equal((parseInt(blockId) - 1) + '');
            const difficulty = await blockPage.getDifficulty();
            expect(difficulty).not.equal("");
            const bits = await blockPage.getBits();
            expect(bits).not.equal("");
            const size = await blockPage.getSize();
            expect(size).not.equal("");
            const version = await blockPage.getVersion();
            expect(isInteger(parseInt(version))).equal(true);
            const nonce = await blockPage.getNonce();
            expect(isInteger(parseInt(nonce))).equal(true);
            const nextBlock = await blockPage.getNextBlock();
            expect(nextBlock).equal((parseInt(blockId) + 1) + '');

            expect(await blockPage.getTrxHash()).equal(trxHash);
        });
    });

});
