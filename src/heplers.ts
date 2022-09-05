export const parseCommand = (text: string) => {
    const [command, ...args] = text.split(' ');
    return { command: command && command.replace(/^\//, ''), args };
};
