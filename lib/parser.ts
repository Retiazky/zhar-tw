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

export const stringifyDescription = (title: string, description: string) => {
  if (!title || !description) {
    throw new Error('Title and description cannot be empty');
  }
  return `${title}#$&${description}`;
};
