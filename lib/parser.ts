export const parseDescription = (description: string) => {
  const [title, ...rest] = description.split('#$&');
  if (rest.length === 0) {
    return {
      title: 'Missing title',
      description: description,
    };
  }
  return {
    title: title.trim(),
    description: rest.join('#$&').trim(),
  };
};
