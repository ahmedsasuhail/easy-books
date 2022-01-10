/// Routes configuration for backend.
#[get("/")]
pub fn index() -> &'static str {
    "Welcome to Easy Books!"
}
