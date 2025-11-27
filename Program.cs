var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = "docs"
});

var app = builder.Build();

app.UseDefaultFiles(); // looks for index.html
app.UseStaticFiles();  // serves from docs now

app.Run();
