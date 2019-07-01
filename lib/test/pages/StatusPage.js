const StatusPage = function () {
  const syncProgress = element(by.xpath('//table//tr[1]//td[2]'));
  const currentSyncStatus = element(by.xpath('//table//tr[2]//td[2]'));
  const startDate = element(by.xpath('//table//tr[3]//td[2]'));
  const initialBlockChainHeight = element(by.xpath('//table//tr[5]//td[2]'));
  const syncedBlocks = element(by.xpath('//table//tr[6]//td[2]'));
  const skippedBlocks = element(by.xpath('//table//tr[7]//td[2]'));
  const syncType = element(by.xpath('//table//tr[8]//td[2]'));

  const lastBlockHash = element(by.xpath('//table[2]//tr[1]//td[2]'));
  const currentBlockchainTip = element(by.xpath('//table[2]//tr[2]//td[2]'));

  const version = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[1]//td[2]"));
  const protocolVersion = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[2]//td[2]"));
  const blocks = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[3]//td[2]"));
  const timeOffset = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[4]//td[2]"));
  const connections = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[5]//td[2]"));
  const miningDifficulty = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[6]//td[2]"));
  const network = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[7]//td[2]"));
  const proxySetting = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[8]//td[2]"));
  const infoErrors = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[9]//td[2]"));


  this.getSyncProgress = function () {
    return syncProgress.getText();
  };

  this.getCurrentSyncStatus = function () {
    return currentSyncStatus.getText();
  };

  this.getStartDate = function () {
    return startDate.getText();
  };

  this.getInitialBlockChainHeight = function () {
    return initialBlockChainHeight.getText();
  };

  this.getSkippedBlocks = function () {
    return skippedBlocks.getText();
  };

  this.getSyncedBlocks = function () {
    return syncedBlocks.getText();
  };

  this.getSyncType = function () {
    return syncType.getText();
  };

  this.getLastBlockHash = function () {
    return lastBlockHash.getText();
  };

  this.getCurrentBlockchainTip = function () {
    return currentBlockchainTip.getText();
  };

  this.getVersion = function () {
    return version.getText();
  };

  this.getProtocolVersion = function () {
    return protocolVersion.getText();
  };

  this.getBlocks = function () {
    return blocks.getText();
  };

  this.getTimeOffset = function () {
    return timeOffset.getText();
  };

  this.getConnections = function () {
    return connections.getText();
  };

  this.getMiningDifficulty = function () {
    return miningDifficulty.getText();
  };

  this.getNetwork = function () {
    return network.getText();
  };

  this.getProxySetting = function () {
    return proxySetting.getText();
  };

  this.getInfoErrors = function () {
    return infoErrors.getText();
  };
};
module.exports = new StatusPage();
