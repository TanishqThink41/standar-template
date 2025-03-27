import matplotlib.pyplot as plt
import io
import base64

def generate_bar_chart(bargraph_data: dict) -> str:
    """
    Expects bargraph_data to be a dict with two keys:
      - "labels": list of labels for the x-axis.
      - "values": list of numeric values corresponding to each label.
    Returns:
      A base64 encoded PNG image.
    """
    labels = bargraph_data.get("labels", [])
    values = bargraph_data.get("values", [])

    if not labels or not values or len(labels) != len(values):
        raise ValueError("Invalid bargraph data. Ensure 'labels' and 'values' are non-empty lists of equal length.")

    # Create the bar graph.
    plt.figure(figsize=(6, 4))
    plt.bar(labels, values, color='skyblue')
    plt.xlabel('Categories')
    plt.ylabel('Values')
    plt.title('Bar Graph')
    plt.tight_layout()

    # Save the figure to a BytesIO buffer.
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    
    # Convert the image buffer to a base64 string.
    image_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    plt.close()  # Close the figure to free resources.
    return image_base64