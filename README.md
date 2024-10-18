# How to use

```bash
npm install
```
Now expose port 5173 in your firewall

windows defender firewall 
-> create new inbound rule 
-> check port click next
-> select TCP and enter 5173 for the port click next 
-> allow the connection and click next
name the rule

now go back to your application folder and run
```bash
npm run dev -- --host
```