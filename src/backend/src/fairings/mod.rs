use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{Header, Method, Status};
use rocket::{Request, Response};

/// Custom fairing that provides CORS middleware functionality.
pub struct CORSFairing;

#[rocket::async_trait]
impl Fairing for CORSFairing {
    fn info(&self) -> Info {
        Info {
            name: "CORS Fairing",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, DELETE, OPTIONS",
        ));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));

        if response.status() == Status::NotFound && request.method() == Method::Options {
            response.set_status(Status::NoContent);
        }
    }
}
