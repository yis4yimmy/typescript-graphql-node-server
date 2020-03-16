export const sendMail = jest.fn().mockImplementation(() => ({
  response: "250 Accepted [STATUS=new MSGID=Some.Test.Id]"
}));
