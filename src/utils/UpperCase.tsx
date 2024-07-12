const capitalizeFirstLetterOfWords = (text: string): string => {
    return text.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  };

export {capitalizeFirstLetterOfWords};