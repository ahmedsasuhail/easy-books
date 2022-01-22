/// This module contains utility and helper functions.
use sha3::{Digest, Sha3_512};

/// Hashes and returns a string using the SHA3-512 algorithm.
///
/// # Arguments
///
/// * `s` - The string to hash.
pub fn hash_sha3_512(s: &str) -> String {
    let mut hasher = Sha3_512::new();
    hasher.update(s);
    let hashed_str = hasher.finalize();

    format!("{:x}", hashed_str)
}
