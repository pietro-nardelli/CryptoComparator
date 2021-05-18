/* Original colors
var color1="rgb(2, 200, 255)"; 
var color2= "#FF6600";
*/

var color1="rgb(2, 200, 255)"; 
var color2= "#FF6600";

var crypto_name_matrix1, crypto_name_matrix2;

var M_CAP_ordered_list = ["Bitcoin", "Ethereum", "Bitcoin Cash", "Ripple", "Dash", "Litecoin", "NEM", "IOTA", "Monero", "Ethereum Classic", "NEO", "BitConnect", "Lisk", "Zcash", "Stratis", "Waves", "Ark", "Steem", "Bytecoin", "Decred", "BitShares", "Stellar Lumens", "Hshare", "Komodo", "PIVX", "Factom", "Byteball Bytes", "Nexus", "Siacoin", "DigiByte", "BitcoinDark", "GameCredits", "GXShares", "Lykke", "Dogecoin", "Blocknet", "Syscoin", "Verge", "FirstCoin", "Nxt", "I-O Coin", "Ubiq", "Particl", "NAV Coin", "Rise", "Vertcoin", "Bitdeal", "FairCoin", "Metaverse ETP", "Gulden", "ZCoin", "CloakCoin", "NoLimitCoin", "Elastic", "Peercoin", "Aidos Kuneen", "ReddCoin", "LEOcoin", "Counterparty", "MonaCoin", "DECENT", "The ChampCoin", "Viacoin", "Emercoin", "Crown", "Sprouts", "ION", "Namecoin", "Clams", "BitBay", "OKCash", "Unobtanium", "Diamond", "Skycoin", "MonetaryUnit", "SpreadCoin", "Mooncoin", "Expanse", "SIBCoin", "ZenCash", "PotCoin", "Radium", "Burst", "LBRY Credits", "Shift", "DigitalNote", "Neblio", "Einsteinium", "Compcoin", "Omni", "ATC Coin", "Energycoin", "Rubycoin", "Gambit", "E-coin", "SaluS", "Groestlcoin", "BlackCoin", "Golos", "GridCoin"]

var SIMIL_CARD_ordered_list = ["Decred", "BitBay", "Factom", "Gambit", "Radium", "Ethereum", "Ethereum Classic", "Shift", "MonetaryUnit", "Energycoin", "Expanse", "Lykke", "Waves", "Dash", "Ubiq", "Syscoin", "Einsteinium", "Viacoin", "Burst", "PotCoin", "GameCredits", "Stratis", "NEM", "Litecoin", "Unobtanium", "BitcoinDark", "Bitcoin", "Diamond", "Vertcoin", "Omni", "Crown", "ReddCoin", "BlackCoin", "SpreadCoin", "FirstCoin", "Siacoin", "Nexus", "Monero", "GridCoin", "Blocknet", "Ripple", "Counterparty", "FairCoin", "I-O Coin", "BitConnect", "Nxt", "Dogecoin", "Bytecoin", "SaluS", "Clams", "PIVX", "Gulden", "Verge", "BitShares", "DigitalNote", "Namecoin", "ION", "Peercoin", "DigiByte", "CloakCoin", "Byteball Bytes", "MonaCoin", "Ark", "Aidos Kuneen", "NAV Coin", "Komodo", "Stellar Lumens", "Lisk", "Groestlcoin", "LBRY Credits", "SIBCoin", "Mooncoin", "Emercoin", "NoLimitCoin", "ZCoin", "Steem", "Zcash", "NEO", "IOTA", "Golos", "E-coin", "Rubycoin", "ATC Coin", "Compcoin", "Neblio", "ZenCash", "Skycoin", "OKCash", "Sprouts", "The ChampCoin", "DECENT", "LEOcoin", "Elastic", "Metaverse ETP", "Bitdeal", "Rise", "Particl", "GXShares", "Hshare", "Bitcoin Cash"]


/*
card_list=
my_list=[]
for(i=0;i<100;i++){my_list.push([card_list[i],M_CAP_ordered_list[i]])}
test_list=[]
for(j=0;j<100;j++){test_list.push(my_list[j][1])}
test_list.reverse()
*/