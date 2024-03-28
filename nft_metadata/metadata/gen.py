#coding:utf8
import json


template = """
{
    "description": "Fansland is the first redefines music festival experience with innovative Web3.0 technology, art and music will be landed in Bangkok 2024. We're All Gonna Make It.",
    "image": "ipfs://bafybeieawzz6q3u7lqbnodctnknirquqo3j2iejeju3w544lksloa4jcgy",
    "name": "Early Bird ",
    "attributes": [
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
            "value": "18:00(UTC+7, Bangkok Time) 4-5 May 2024"
        },
        {
            "trait_type": "Event Location",
            "value": "Impact Exhibition Hall 5-8, Bangkok, Thailand"
        },
        {
            "trait_type": "Website",
            "value": "fansland.io"
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