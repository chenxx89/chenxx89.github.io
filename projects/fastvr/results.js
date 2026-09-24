/* Values transcribed from the FastVR technical report and teaser; no AIGC benchmark. */
window.FASTVR_RESULTS = {
  "source": "FastVR technical report, quantitative results table",
  "methods": [
    "STAR",
    "SeedVR",
    "Vivid-VR",
    "DOVE",
    "SATB-VR",
    "SeedVR2",
    "FlashVSR-Tiny",
    "FlashVSR-Full",
    "FastVR"
  ],
  "datasets": [
    {
      "name": "SPMCS",
      "type": "Synthetic",
      "metrics": [
        {
          "name": "PSNR",
          "higherIsBetter": true,
          "values": [
            "24.18",
            "24.08",
            "21.73",
            "24.80",
            "24.18",
            "26.07",
            "23.57",
            "23.44",
            "23.50"
          ]
        },
        {
          "name": "SSIM",
          "higherIsBetter": true,
          "values": [
            "0.720",
            "0.689",
            "0.604",
            "0.754",
            "0.707",
            "0.777",
            "0.675",
            "0.670",
            "0.662"
          ]
        },
        {
          "name": "LPIPS",
          "higherIsBetter": false,
          "values": [
            "0.301",
            "0.263",
            "0.278",
            "0.168",
            "0.197",
            "0.191",
            "0.223",
            "0.226",
            "0.221"
          ]
        },
        {
          "name": "NIQE",
          "higherIsBetter": false,
          "values": [
            "7.058",
            "4.514",
            "3.457",
            "4.031",
            "4.047",
            "4.969",
            "3.496",
            "3.278",
            "3.505"
          ]
        },
        {
          "name": "MANIQA",
          "higherIsBetter": true,
          "values": [
            "0.229",
            "0.315",
            "0.410",
            "0.346",
            "0.384",
            "0.305",
            "0.361",
            "0.381",
            "0.400"
          ]
        },
        {
          "name": "MUSIQ",
          "higherIsBetter": true,
          "values": [
            "30.62",
            "56.99",
            "70.03",
            "63.29",
            "67.82",
            "53.23",
            "66.27",
            "67.91",
            "71.23"
          ]
        },
        {
          "name": "CLIP-IQA",
          "higherIsBetter": true,
          "values": [
            "0.254",
            "0.347",
            "0.483",
            "0.410",
            "0.514",
            "0.325",
            "0.512",
            "0.571",
            "0.586"
          ]
        },
        {
          "name": "DOVER",
          "higherIsBetter": true,
          "values": [
            "4.266",
            "9.779",
            "11.35",
            "9.898",
            "10.65",
            "8.625",
            "10.33",
            "10.38",
            "11.71"
          ]
        }
      ]
    },
    {
      "name": "UDM10",
      "type": "Synthetic",
      "metrics": [
        {
          "name": "PSNR",
          "higherIsBetter": true,
          "values": [
            "27.29",
            "27.80",
            "24.54",
            "30.53",
            "28.67",
            "29.04",
            "26.82",
            "26.36",
            "28.76"
          ]
        },
        {
          "name": "SSIM",
          "higherIsBetter": true,
          "values": [
            "0.855",
            "0.848",
            "0.761",
            "0.894",
            "0.859",
            "0.884",
            "0.806",
            "0.797",
            "0.842"
          ]
        },
        {
          "name": "LPIPS",
          "higherIsBetter": false,
          "values": [
            "0.167",
            "0.148",
            "0.243",
            "0.101",
            "0.150",
            "0.117",
            "0.172",
            "0.182",
            "0.154"
          ]
        },
        {
          "name": "NIQE",
          "higherIsBetter": false,
          "values": [
            "6.072",
            "5.345",
            "4.046",
            "5.055",
            "4.283",
            "5.641",
            "3.941",
            "3.779",
            "3.742"
          ]
        },
        {
          "name": "MANIQA",
          "higherIsBetter": true,
          "values": [
            "0.260",
            "0.264",
            "0.359",
            "0.296",
            "0.381",
            "0.262",
            "0.341",
            "0.364",
            "0.381"
          ]
        },
        {
          "name": "MUSIQ",
          "higherIsBetter": true,
          "values": [
            "45.38",
            "50.29",
            "64.71",
            "55.17",
            "65.83",
            "48.91",
            "62.49",
            "65.07",
            "67.50"
          ]
        },
        {
          "name": "CLIP-IQA",
          "higherIsBetter": true,
          "values": [
            "0.289",
            "0.273",
            "0.426",
            "0.340",
            "0.507",
            "0.272",
            "0.494",
            "0.556",
            "0.568"
          ]
        },
        {
          "name": "DOVER",
          "higherIsBetter": true,
          "values": [
            "9.454",
            "9.349",
            "11.97",
            "10.41",
            "10.98",
            "8.752",
            "11.52",
            "11.60",
            "11.86"
          ]
        }
      ]
    },
    {
      "name": "YouHQ40",
      "type": "Synthetic",
      "metrics": [
        {
          "name": "PSNR",
          "higherIsBetter": true,
          "values": [
            "22.92",
            "22.46",
            "21.31",
            "24.10",
            "23.67",
            "24.00",
            "22.77",
            "22.56",
            "23.10"
          ]
        },
        {
          "name": "SSIM",
          "higherIsBetter": true,
          "values": [
            "0.657",
            "0.621",
            "0.579",
            "0.688",
            "0.657",
            "0.693",
            "0.608",
            "0.602",
            "0.621"
          ]
        },
        {
          "name": "LPIPS",
          "higherIsBetter": false,
          "values": [
            "0.433",
            "0.240",
            "0.357",
            "0.283",
            "0.281",
            "0.185",
            "0.300",
            "0.290",
            "0.271"
          ]
        },
        {
          "name": "NIQE",
          "higherIsBetter": false,
          "values": [
            "6.744",
            "4.243",
            "3.410",
            "4.456",
            "4.004",
            "4.576",
            "3.603",
            "3.465",
            "3.207"
          ]
        },
        {
          "name": "MANIQA",
          "higherIsBetter": true,
          "values": [
            "0.240",
            "0.315",
            "0.372",
            "0.304",
            "0.354",
            "0.314",
            "0.347",
            "0.367",
            "0.380"
          ]
        },
        {
          "name": "MUSIQ",
          "higherIsBetter": true,
          "values": [
            "36.36",
            "61.91",
            "70.55",
            "60.65",
            "67.91",
            "59.34",
            "66.87",
            "69.62",
            "72.91"
          ]
        },
        {
          "name": "CLIP-IQA",
          "higherIsBetter": true,
          "values": [
            "0.279",
            "0.360",
            "0.447",
            "0.356",
            "0.486",
            "0.336",
            "0.527",
            "0.590",
            "0.620"
          ]
        },
        {
          "name": "DOVER",
          "higherIsBetter": true,
          "values": [
            "7.868",
            "14.00",
            "14.61",
            "12.52",
            "13.25",
            "12.80",
            "13.70",
            "13.84",
            "14.57"
          ]
        }
      ]
    },
    {
      "name": "VideoLQ",
      "type": "Real-world",
      "metrics": [
        {
          "name": "NIQE",
          "higherIsBetter": false,
          "values": [
            "5.789",
            "4.994",
            "4.371",
            "5.049",
            "4.260",
            "5.674",
            "4.060",
            "3.892",
            "3.759"
          ]
        },
        {
          "name": "MANIQA",
          "higherIsBetter": true,
          "values": [
            "0.271",
            "0.223",
            "0.319",
            "0.272",
            "0.356",
            "0.221",
            "0.278",
            "0.299",
            "0.361"
          ]
        },
        {
          "name": "MUSIQ",
          "higherIsBetter": true,
          "values": [
            "50.52",
            "46.49",
            "62.47",
            "55.11",
            "65.59",
            "43.41",
            "57.54",
            "61.88",
            "69.17"
          ]
        },
        {
          "name": "CLIP-IQA",
          "higherIsBetter": true,
          "values": [
            "0.265",
            "0.229",
            "0.338",
            "0.271",
            "0.436",
            "0.220",
            "0.348",
            "0.405",
            "0.446"
          ]
        },
        {
          "name": "DOVER",
          "higherIsBetter": true,
          "values": [
            "8.758",
            "7.240",
            "9.743",
            "8.780",
            "9.577",
            "6.331",
            "8.954",
            "9.360",
            "9.761"
          ]
        }
      ]
    },
    {
      "name": "UGC50",
      "type": "Real-world",
      "metrics": [
        {
          "name": "NIQE",
          "higherIsBetter": false,
          "values": [
            "5.754",
            "5.662",
            "4.361",
            "5.493",
            "4.672",
            "6.230",
            "4.083",
            "3.887",
            "3.891"
          ]
        },
        {
          "name": "MANIQA",
          "higherIsBetter": true,
          "values": [
            "0.325",
            "0.262",
            "0.376",
            "0.320",
            "0.402",
            "0.253",
            "0.354",
            "0.372",
            "0.379"
          ]
        },
        {
          "name": "MUSIQ",
          "higherIsBetter": true,
          "values": [
            "55.01",
            "49.76",
            "67.61",
            "57.82",
            "68.52",
            "46.12",
            "63.85",
            "65.66",
            "68.92"
          ]
        },
        {
          "name": "CLIP-IQA",
          "higherIsBetter": true,
          "values": [
            "0.353",
            "0.305",
            "0.450",
            "0.353",
            "0.571",
            "0.276",
            "0.516",
            "0.563",
            "0.587"
          ]
        },
        {
          "name": "DOVER",
          "higherIsBetter": true,
          "values": [
            "10.92",
            "10.47",
            "14.46",
            "11.84",
            "13.40",
            "8.209",
            "13.40",
            "13.29",
            "13.86"
          ]
        }
      ]
    }
  ],
  "efficiency": [
    {
      "method": "FastVR",
      "fps": 11.0,
      "memory": 21.96
    },
    {
      "method": "FlashVSR-Tiny",
      "fps": 5.3,
      "memory": 24.49
    },
    {
      "method": "FlashVSR-Full",
      "fps": 2.37,
      "memory": 46.68
    },
    {
      "method": "SeedVR2-7B",
      "fps": 0.79,
      "memory": 83.74
    },
    {
      "method": "DOVE",
      "fps": 0.43,
      "memory": 40.9
    },
    {
      "method": "SATB-VR",
      "fps": 0.36,
      "memory": 40.25
    }
  ]
};
