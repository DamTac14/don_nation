async function GetAPIFunction(API_Road, id = null) {

    const ipAddress = window.location.hostname;

    // Condition to the get to know if we use an id or not
    
    const url = id ? `http://${ipAddress}:7005/api/${API_Road}/${id}` 
                    : `http://${ipAddress}:7005/api/${API_Road}`;
    
    // Fetch function with await because the function was async
    const response = await fetch(url, {
      method:'GET',
      credentials: 'include'
    });
    
    // Result was return on .json format 
    const result = await response.json();
    return result;

}

export default GetAPIFunction