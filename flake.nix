{
  description = "jwt-config";

  inputs.nixpkgs.url = github:nixos/nixpkgs/nixos-21.05;

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in {
      defaultPackage.x86_64-linux = (pkgs.callPackage ./default.nix { }).package;

      overlay = final: prev: {
        jwt-config = (final.callPackage ./default.nix { }).package ;
      };

      devShell.x86_64-linux = pkgs.mkShell {
        buildInputs = [
          pkgs.openssl
          pkgs.nodejs
          pkgs.nodePackages.node2nix
        ];
      };
    };
}

