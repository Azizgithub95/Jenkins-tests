#!/usr/bin/env python3
import sys, json
import matplotlib.pyplot as plt

def main():
    if len(sys.argv) != 3:
        print("Usage: generate_k6_screenshot.py <summary.json> <output.png>")
        sys.exit(1)

    summary_path, output_path = sys.argv[1], sys.argv[2]
    data = json.load(open(summary_path))
    m = data.get('metrics', {})

    # Exemple : trace la latence moyenne et les requêtes/s
    names  = ['http_req_duration', 'http_reqs']
    values = [
        m.get('http_req_duration',{}).get('avg', 0),
        m.get('http_reqs',{}).get('rate', 0)
    ]

    plt.figure(figsize=(6,4))
    plt.bar(names, values)
    plt.title('K6 Summary')
    plt.ylabel('Valeur')
    plt.tight_layout()
    plt.savefig(output_path)

if __name__ == '__main__':
    main()
