#coding:utf8
import json


template = """
{
    "description": "Website: https://fansland.io   Fansland is the first redefines music festival experience with innovative Web3.0 technology, art and music will be landed in Bangkok 2024. We're All Gonna Make It.",
    "image": "ipfs://bafybeihven5mhsobf4tkbtaubvpjzerrcsytesolqh6rcefmpdwqabiuhi",
    "name": "Early Bird ",
    "attributes": [
        {
            "trait_type": "Website",
            "value": "fansland.io"
        },
        {
            "trait_type": "Event Name",
            "value": "Fansland Web3 Music Festival 2024"
        },
        {
            "trait_type": "Ticket Type",
            "value": "Early Bird 2 Days Ticket"
        },
        {
            "trait_type": "Event Time",
            "value": "18:00(UTC+7) May 4-5, 2024"
        },
        {
            "trait_type": "Event Location",
            "value": "Impact Exhibition Hall 5-8, Bangkok, Thailand"
        },
        {
            "trait_type": "Blockchain",
            "value": "BNB Chain"
        },
        {
            "trait_type": "Contract",
            "value": "0xBf36aB3AeD81Bf8553B52c61041904d98Ee882C2"
        },
        {
            "trait_type": "Block Explorer",
            "value": "https://bscscan.com/0xBf36aB3AeD81Bf8553B52c61041904d98Ee882C2"
        }
    ]
}
"""


def main():
    for i in range(0, 1000):

        s = json.loads(template)
        s['name'] = "Early Bird #{}".format(i)
        with open(f'./early_bird_1000/{i}', 'w') as ofile:
            json.dump(fp=ofile, obj=s ,indent=4)
    pass


if __name__ == '__main__':

    main()