/* Original colors
var color1="rgb(2, 200, 255)"; 
var color2= "#FF6600";
*/

var color1="rgb(2, 200, 255)"; 
var color2= "#FF6600";

var crypto_name_matrix1, crypto_name_matrix2;

var M_CAP_ordered_list = ["Bitcoin", "Ethereum", "Bitcoin Cash", "Ripple", "Dash", "Litecoin", "NEM", "IOTA", "Monero", "Ethereum Classic", "NEO", "BitConnect", "Lisk", "Zcash", "Stratis", "Waves", "Ark", "Steem", "Bytecoin", "Decred", "BitShares", "Stellar Lumens", "Hshare", "Komodo", "PIVX", "Factom", "Byteball Bytes", "Nexus", "Siacoin", "DigiByte", "BitcoinDark", "GameCredits", "GXShares", "Lykke", "Dogecoin", "Blocknet", "Syscoin", "Verge", "FirstCoin", "Nxt", "I-O Coin", "Ubiq", "Particl", "NAV Coin", "Rise", "Vertcoin", "Bitdeal", "FairCoin", "Metaverse ETP", "Gulden", "ZCoin", "CloakCoin", "NoLimitCoin", "Elastic", "Peercoin", "Aidos Kuneen", "ReddCoin", "LEOcoin", "Counterparty", "MonaCoin", "DECENT", "The ChampCoin", "Viacoin", "Emercoin", "Crown", "Sprouts", "ION", "Namecoin", "Clams", "BitBay", "OKCash", "Unobtanium", "Diamond", "Skycoin", "MonetaryUnit", "SpreadCoin", "Mooncoin", "Expanse", "SIBCoin", "ZenCash", "PotCoin", "Radium", "Burst", "LBRY Credits", "Shift", "DigitalNote", "Neblio", "Einsteinium", "Compcoin", "Omni", "ATC Coin", "Energycoin", "Rubycoin", "Gambit", "E-coin", "SaluS", "Groestlcoin", "BlackCoin", "Golos", "GridCoin"]

var SIMIL_CARD_ordered_list = ["Decred", "BitBay", "Factom", "Gambit", "Radium", "Ethereum", "Ethereum Classic", "Shift", "MonetaryUnit", "Energycoin", "Expanse", "Lykke", "Waves", "Dash", "Ubiq", "Syscoin", "Einsteinium", "Viacoin", "Burst", "PotCoin", "GameCredits", "Stratis", "NEM", "Litecoin", "Unobtanium", "BitcoinDark", "Bitcoin", "Diamond", "Vertcoin", "Omni", "Crown", "ReddCoin", "BlackCoin", "SpreadCoin", "FirstCoin", "Siacoin", "Nexus", "Monero", "GridCoin", "Blocknet", "Ripple", "Counterparty", "FairCoin", "I-O Coin", "BitConnect", "Nxt", "Dogecoin", "Bytecoin", "SaluS", "Clams", "PIVX", "Gulden", "Verge", "BitShares", "DigitalNote", "Namecoin", "ION", "Peercoin", "DigiByte", "CloakCoin", "Byteball Bytes", "MonaCoin", "Ark", "Aidos Kuneen", "NAV Coin", "Komodo", "Stellar Lumens", "Lisk", "Groestlcoin", "LBRY Credits", "SIBCoin", "Mooncoin", "Emercoin", "NoLimitCoin", "ZCoin", "Steem", "Zcash", "NEO", "IOTA", "Golos", "E-coin", "Rubycoin", "ATC Coin", "Compcoin", "Neblio", "ZenCash", "Skycoin", "OKCash", "Sprouts", "The ChampCoin", "DECENT", "LEOcoin", "Elastic", "Metaverse ETP", "Bitdeal", "Rise", "Particl", "GXShares", "Hshare", "Bitcoin Cash"]

var similarities_grades_MCAP_ordered = [18, 32, 1, 12, 24, 19, 20, 2, 13, 29, 2, 11, 3, 2, 20, 25, 4, 2, 10, 35, 7, 3, 1, 3, 8, 34, 5, 13, 13, 6, 18, 20, 1, 25, 10, 12, 22, 7, 13, 10, 11, 23, 1, 3, 1, 16, 1, 11, 1, 7, 2, 5, 2, 1, 6, 3, 15, 1, 11, 4, 1, 1, 21, 2, 15, 1, 6, 6, 9, 34, 1, 18, 17, 1, 27, 14, 2, 26, 2, 1, 20, 32, 20, 2, 27, 6, 1, 21, 1, 15, 1, 26, 1, 33, 1, 9, 2, 14, 1, 12]

/*
card_list=
my_list=[]
for(i=0;i<100;i++){my_list.push([card_list[i],M_CAP_ordered_list[i]])}
test_list=[]
for(j=0;j<100;j++){test_list.push(my_list[j][1])}
test_list.reverse()
*/