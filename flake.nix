{
  description = "jwt-config";

  inputs.nixpkgs.url = github:nixos/nixpkgs/nixos-22.11;

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in {
      defaultPackage.x86_64-linux = pkgs.buildNpmPackage {
        name = "jwt-gen";
        src = ./.;
        npmDepsHash = "sha256-da7XOML3fcX7oYAUWYLYDCwfM2s3dbojhtLuPqg+sZ0=";
        dontNpmBuild = true;
      };

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

