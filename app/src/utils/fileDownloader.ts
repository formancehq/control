export default (url: string, filename: string, extension: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.download = `${filename}.${extension}`;
  link.click();
};
