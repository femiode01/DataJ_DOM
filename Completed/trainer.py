import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--kernel", type=str, default="rbf", help="The kernel type")
parser.add_argument("--C", type=float, default=1.0, help="The regularization parameter")

args = parser.parse_args()

kernel = args.kernel
C = args.C

# Train the model
train_model(kernel, C)

# Evaluate the model
evaluate_model()
