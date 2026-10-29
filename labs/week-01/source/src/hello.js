const student = {
  name: "kamonwan Reanu",
  studentId: "68543210060-8",
  os: process.platform,
  node: process.version,
};

function createGreeting(info) {
return "Hello " + info.name + " (" + info.studentId + ") | OS: " + info.os + " | Node: " + info.node;
}

console.log(createGreeting(student));
