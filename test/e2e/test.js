const { expect } = require('chai');
const {
  Builder, Browser,
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const wait = require('../../lib/test/util/wait');

const TopPanel = require('../../lib/test/pages/TopPanel');
const StatusPage = require('../../lib/test/pages/StatusPage');
const BlockPage = require('../../lib/test/pages/BlockPage');

describe('basic UI tests', () => {
  let url;
  let browser;
  let blockHash;
  let topPanel;
  let statusPage;
  let blockPage;
  let trxHash;

  // eslint-disable-next-line no-undef
  before(async () => {
    browser = await new Builder()
      .forBrowser(Browser.CHROME)
      .setChromeOptions(new chrome.Options()
        .addArguments('--headless')
        .windowSize({
          width: 1280,
          height: 720,
        }))
      .build();
    url = 'https://insight.testnet.networks.dash.org/insight/';
  });

  describe('Home Page', () => {
    it('should be able to open main page', async () => {
      await browser.get(url);
      await wait(10000);
      const title = await browser.getTitle();
      expect(title).equal('Home | Insight');
    });

    it('should be able to open block page', async () => {
      topPanel = new TopPanel(browser);
      await topPanel.openBlockPage();
      const title = await browser.getTitle();
      expect(title).equal('Home | Insight');
    });

    it('should be able to open status page', async () => {
      await topPanel.openStatusPage();
      await wait(10000); // time to complete sync
      const title = await browser.getTitle();
      expect(title).equal('Status | Insight');

      statusPage = new StatusPage(browser);

      const syncProgress = await statusPage.getSyncProgress();
      expect(syncProgress).equal('100% Complete');

      const currentSyncStatus = await statusPage.getCurrentSyncStatus();
      expect(currentSyncStatus).equal('finished');

      const startDate = await statusPage.getStartDate();
      expect(startDate).equal('Invalid date');

      const initialBlockChainHeight = await statusPage.getInitialBlockChainHeight();
      expect(Number.isInteger(parseInt(initialBlockChainHeight, 10))).equal(true);

      const syncedBlocks = await statusPage.getSyncedBlocks();
      expect(syncedBlocks).equal('');

      const skippedBlocks = await statusPage.getSkippedBlocks();
      expect(skippedBlocks).equal('');

      const syncType = await statusPage.getSyncType();
      expect(syncType).equal('bitcore node');

      const lastBlockHash = await statusPage.getLastBlockHash();
      expect(lastBlockHash).not.equal(undefined);

      const currentBlockchainTip = await statusPage.getCurrentBlockchainTip();
      expect(currentBlockchainTip).not.equal(undefined);

      const version = await statusPage.getVersion();
      expect(Number.isInteger(parseInt(version, 10))).equal(true);

      const protocolVersion = await statusPage.getProtocolVersion();
      expect(Number.isInteger(parseInt(protocolVersion, 10))).equal(true);

      const timeOffset = await statusPage.getTimeOffset();
      expect(timeOffset).equal('0');

      const miningDifficulty = await statusPage.getMiningDifficulty();
      expect(miningDifficulty).not.equal('');

      const network = await statusPage.getNetwork();
      expect(network).equal('testnet');

      const proxySetting = await statusPage.getProxySetting();
      expect(proxySetting).equal('');

      const infoErrors = await statusPage.getInfoErrors();
      expect(infoErrors).equal('');
    });

    it('should be able to route to block number', async () => {
      const blockIdToSearch = '12';

      await browser.get(`${url}block/${blockIdToSearch}`);
      await wait(10000);

      blockPage = new BlockPage(browser);

      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).equal(`${url}block/${blockIdToSearch}`);

      const blockId = (await blockPage.getBlockId()).replace('Block #', '');
      expect(blockId).equal(blockIdToSearch);
      blockHash = await blockPage.getBlockHash();

      const nextBlock = await blockPage.getNextBlock();

      expect(nextBlock).equal(`${parseInt(blockId, 10) + 1}`);
    });

    it('should be able search by block number', async () => {
      const blockIdToSearch = '12';
      topPanel = new TopPanel(browser);

      topPanel.search(blockIdToSearch);

      await wait(10000);

      // init again after page switch
      blockPage = new BlockPage(browser);

      // When search from insight search pane, it will redirect to blockHash in url
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).equal(`${url}block/${blockHash}`);

      const blockId = (await blockPage.getBlockId()).replace('Block #', '');
      expect(blockId).equal(blockIdToSearch);
      blockHash = await blockPage.getBlockHash();

      const numberOfTrxs = await blockPage.getNumberOfTrxs();
      expect(numberOfTrxs).equal('1');

      const height = await blockPage.getHeight();
      expect(height).equal(`${blockIdToSearch} (Mainchain)`);

      const blockReward = await blockPage.getBlockReward();
      expect(blockReward).equal('500 DASH');

      const timestamp = await blockPage.getTimestamp();
      expect(timestamp).not.equal('');
      const minedBy = await blockPage.getMinedBy();
      expect(minedBy).equal('');
      const merkleRoot = await blockPage.getMerkleRoot();
      expect(merkleRoot).not.equal('');
      const previousBlock = await blockPage.getPreviousBlock();
      expect(previousBlock).equal(`${parseInt(blockId, 10) - 1}`);
      const difficulty = await blockPage.getDifficulty();
      expect(difficulty).not.equal('');
      const bits = await blockPage.getBits();
      expect(bits).not.equal('');
      const size = await blockPage.getSize();
      expect(size).not.equal('');
      const version = await blockPage.getVersion();
      expect(Number.isInteger(parseInt(version, 10))).equal(true);
      const nonce = await blockPage.getNonce();
      expect(Number.isInteger(parseInt(nonce, 10))).equal(true);
      const nextBlock = await blockPage.getNextBlock();

      expect(nextBlock).equal(`${parseInt(blockId, 10) + 1}`);
      trxHash = await blockPage.getTrxHash();
    });

    it('should be able search by block hash', async () => {
      const blockIdToSearch = '12';
      topPanel.search(blockHash);
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).equal(`${url}block/${blockHash}`);

      const blockId = (await blockPage.getBlockId()).replace('Block #', '');
      expect(blockId).equal(blockIdToSearch);
      expect(await blockPage.getBlockHash()).equal(blockHash);

      const numberOfTrxs = await blockPage.getNumberOfTrxs();
      expect(numberOfTrxs).equal('1');

      const height = await blockPage.getHeight();
      expect(height).equal(`${blockIdToSearch} (Mainchain)`);

      const blockReward = await blockPage.getBlockReward();
      expect(blockReward).equal('500 DASH');

      const timestamp = await blockPage.getTimestamp();
      expect(timestamp).not.equal('');
      const minedBy = await blockPage.getMinedBy();
      expect(minedBy).equal('');
      const merkleRoot = await blockPage.getMerkleRoot();
      expect(merkleRoot).not.equal('');
      const previousBlock = await blockPage.getPreviousBlock();
      expect(previousBlock).equal(`${parseInt(blockId, 10) - 1}`);
      const difficulty = await blockPage.getDifficulty();
      expect(difficulty).not.equal('');
      const bits = await blockPage.getBits();
      expect(bits).not.equal('');
      const size = await blockPage.getSize();
      expect(size).not.equal('');
      const version = await blockPage.getVersion();
      expect(Number.isInteger(parseInt(version, 10))).equal(true);
      const nonce = await blockPage.getNonce();
      expect(Number.isInteger(parseInt(nonce, 10))).equal(true);
      const nextBlock = await blockPage.getNextBlock();
      expect(nextBlock).equal(`${parseInt(blockId, 10) + 1}`);

      expect(await blockPage.getTrxHash()).equal(trxHash);
    });
  });
});
