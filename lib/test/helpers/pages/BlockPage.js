'use strict';
/* jshint ignore:start */
const BlockPage = function() {

    const blockId = element(by.xpath('//*[contains(text(), "Block #")]'));
    const blockHash = element(by.css('.txid.text-muted.ng-binding'));

    const numberOfTrxs = element(by.xpath('//table//tr[1]//td[2]'));
    const height = element(by.xpath('//table//tr[2]//td[2]'));
    const blockReward = element(by.xpath('//table//tr[3]//td[2]'));
    const timestamp = element(by.xpath('//table//tr[4]//td[2]'));
    const minedBy = element(by.xpath('//table//tr[5]//td[2]'));
    const merkleRoot = element(by.xpath('//table//tr[6]//td[2]//span[2]'));
    const previousBlock = element(by.xpath('//table//tr[7]//td[2]'));
    const difficulty = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[1]/td[2]"));
    const bits = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[2]/td[2]"));
    const size = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[3]/td[2]"));
    const version = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[4]/td[2]"));
    const nonce = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[5]/td[2]"));
    const nextBlock = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[6]/td[2]"));

    const trxHash = element(by.xpath("//a[contains(@href,'tx/')]"));

    this.getBlockId = function() {
        return blockId.getText();
    };

    this.getBlockHash = function() {
        return blockHash.getText();
    };

    this.getNumberOfTrxs = function() {
        return numberOfTrxs.getText();
    };

    this.getHeight = function() {
        return height.getText();
    };

    this.getBlockReward = function() {
        return blockReward.getText();
    };

    this.getTimestamp = function() {
        return timestamp.getText();
    };

    this.getMinedBy = function() {
        return minedBy.getText();
    };

    this.getMerkleRoot = function() {
        return merkleRoot.getText();
    };

    this.getPreviousBlock = function() {
        return previousBlock.getText();
    };

    this.getDifficulty = function() {
        return difficulty.getText();
    };

    this.getBits = function() {
        return bits.getText();
    };

    this.getSize = function() {
        return size.getText();
    };

    this.getVersion = function() {
        return version.getText();
    };

    this.getNonce = function() {
        return nonce.getText();
    };

    this.getNextBlock = function() {
        return nextBlock.getText();
    };

    this.getTrxHash = function() {
        return trxHash.getText();
    };

};
module.exports = new BlockPage();
