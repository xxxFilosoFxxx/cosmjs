import { StdFee, SigningStargateClient } from "@filosof-copilot-cosmjs/stargate";
import { DirectSecp256k1HdWallet } from "@filosof-copilot-cosmjs/proto-signing";
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { coins } from "@filosof-copilot-cosmjs/amino";
import { Random } from "@filosof-copilot-cosmjs/crypto";

const defaultHttpUrl = "http://localhost:26658";
const defaultFee: StdFee = {
  amount: [
    {
      amount: "5000",
      denom: "ucosm",
    },
  ],
  gas: "890000",
};

const faucetMnemonic =
  "economy stock theory fatal elder harbor betray wasp final emotion task crumble siren bottom lizard educate guess current outdoor pair theory focus wife stone";
const faucetAddress = "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6";

const wallet = await DirectSecp256k1HdWallet.fromMnemonic(faucetMnemonic);
const client = await SigningStargateClient.connectWithSigner(defaultHttpUrl, wallet);
