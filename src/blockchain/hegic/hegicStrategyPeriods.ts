const strategyContractByPeriod = {
  ETH: {
    CALL: {
      "7-13": {
        period: 1123200,
        contract: "0x09a4B65b3144733f1bFBa6aEaBEDFb027a38Fb60",
      },
      "14-29": {
        period: 2505600,
        contract: "0x6418C3514923a6464A26A2ffA5f17bF1efC96a21",
      },
      "30-59": {
        period: 5097600,
        contract: "0xE377A1a97237b3B89a96d8B731A2ab10d5DaC16C",
      },
      "60-90": {
        period: 7776000,
        contract: "0x2727B807D22fCAeB7F900F49894054Ed92b9125B",
      },
    },
    PUT: {
      "7-13": {
        period: 1123200,
        contract: "0xaA0DfBFb8dA7f45BB41c0fB68B71FAEB959B22aa",
      },
      "14-29": {
        period: 2505600,
        contract: "0x2739A4C003080A5B3Ade22b92c3321EDa2Da3A9e",
      },
      "30-59": {
        period: 5097600,
        contract: "0xf711D0BC60F37cA28845BA623ccd9C635E5073A1",
      },
      "60-90": {
        period: 7776000,
        contract: "0x015FAA9aF7599e6cea597EBC7e7e04A149a3E992",
      },
    },
    STRAP: {
      "7-13": {
        period: 1123200,
        contract: "0x64622a28F97D877E9Ff1E2A7322786A58c3D8Fc7",
      },
      "14-29": {
        period: 2505600,
        contract: "0x64623eA34BC4B0d567b777213dcF9Ae3F8f1388F",
      },
      "30-59": {
        period: 5097600,
        contract: "0x64464e5fd7742277334dA1Fc4C189Ca12c3E30EA",
      },
      "60-90": {
        period: 7776000,
        contract: "0x69f53282F5C237Bac96231757A46D058E6b373d1",
      },
    },
    STRIP: {
      "7-13": {
        period: 1123200,
        contract: "0x812CEcB0519d972809091594B82bf580452955A6",
      },
      "14-29": {
        period: 2505600,
        contract: "0x31791A166EaC17D0C6373011B1AEd06C479EC709",
      },
      "30-59": {
        period: 5097600,
        contract: "0x11aBbA816c2FC023Fe3A15F59E6d576F7557333d",
      },
      "60-90": {
        period: 7776000,
        contract: "0x7AEc8D04A9c5D53244868e1dDA82D4eEe6dE18ec",
      },
    },
    BULL_CALL_SPREAD: {
      "7-13": {
        period: 1123200,
        contract: "0x5c59f7ec23C0Bace3B1959C99A43FFd30078E5bE",
      },
      "14-29": {
        period: 2505600,
        contract: "0x0ac1995C43B5566760AD1D88B812f3e51e12eCc6",
      },
      "30-59": {
        period: 5097600,
        contract: "0xBB318170Ce1c2dc79B564f33F92BacaadaBd22de",
      },
      "60-90": {
        period: 7776000,
        contract: "0xCe5e136688A1553C67b3B39Ff5366595dD0F771E",
      },
    },
    BEAR_PUT_SPREAD: {
      "7-13": {
        period: 1123200,
        contract: "0xc4C3b5050D574CBF3eE0b613104cF5C4E47625d4",
      },
      "14-29": {
        period: 2505600,
        contract: "0x31e6Cd148fe51830E7a97262eE9cf52Fe5256B08",
      },
      "30-59": {
        period: 5097600,
        contract: "0x2B93645f310E016c1a6d1738DCec0f18621F71d0",
      },
      "60-90": {
        period: 7776000,
        contract: "0xfcd40dDe82b699D455B3D073196d580227C2Fba6",
      },
    },
    BULL_PUT_SPREAD: {
      "7-13": {
        period: 1123200,
        contract: "0x74986E5DE2899750229d64f9748B1f23Ee9F5caD",
      },
      "14-29": {
        period: 2505600,
        contract: "0000000000000000000000000000000000000000",
      },
      "30-59": {
        period: 5097600,
        contract: "0000000000000000000000000000000000000000",
      },
      "60-90": {
        period: 7776000,
        contract: "0000000000000000000000000000000000000000",
      },
    },
  },
};
module.exports = { strategyContractByPeriod };
