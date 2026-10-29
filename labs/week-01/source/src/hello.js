const student = {
  name: "Suwimon",
  studentId: "68543210046-7",
  os: process.platform,
  node: process.version,
};

function createGreeting(info) {
return "Hello " + info.name + " (" + info.studentId + ") | OS: " + info.os + " | Node: " + info.node;
}

console.log(createGreeting(student));
