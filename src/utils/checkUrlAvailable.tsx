
  
  async function checkUrlAvailable(src?: string, issueId?: number){

    if (!src ) return;

    // Create a synchronous XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Open the request synchronously
    xhr.open('GET', src, false); // false for synchronous request

    // Send the request
    xhr.send();

    // Check if the status is within the success range (200-299)
    if (xhr.status >= 200 && xhr.status < 300) {
        // If the URL is available, return the URL itself
        return src;
    } else {
        // If the URL is not available, return null
        return null;
    }
  }
  
  export default checkUrlAvailable;
  