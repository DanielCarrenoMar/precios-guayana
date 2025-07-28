
export async function fetchDollarConversion( value: number): Promise<number> {
  const url = `https://pydolarve.org/api/v2/dollar/conversion?type=VES&value=${value}&page=bcv&monitor=usd`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return parseFloat(data);
  } catch (error) {
    console.error("Error fetching dollar conversion:", error);
    throw error;
  }
}

export async function fetchBolivarConversion( value: number): Promise<number> {
  const url = `https://pydolarve.org/api/v2/dollar/conversion?type=VES&value=1&page=bcv&monitor=usd`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    const convertionType =  parseFloat(data)

    return value / convertionType;
  } catch (error) {
    console.error("Error fetching dollar conversion:", error);
    throw error;
  }
}
